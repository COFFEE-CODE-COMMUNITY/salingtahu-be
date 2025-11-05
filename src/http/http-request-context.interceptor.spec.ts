import { Test } from "@nestjs/testing"
import { HttpRequestContextInterceptor } from "./http-request-context.interceptor"
import { HttpRequestContext } from "./http-request-context"
import { mock, MockProxy } from "jest-mock-extended"
import { Request } from "express"
import { ExecutionContext } from "@nestjs/common"
import { CallHandler, HttpArgumentsHost } from "@nestjs/common/interfaces"
import { Observable } from "rxjs"

describe("HttpRequestContextInterceptor", () => {
  let interceptor: HttpRequestContextInterceptor
  let httpRequestContext: MockProxy<HttpRequestContext>

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [
        HttpRequestContextInterceptor,
        {
          provide: HttpRequestContext,
          useValue: mock<HttpRequestContext>()
        }
      ]
    }).compile()

    interceptor = module.get(HttpRequestContextInterceptor)
    httpRequestContext = module.get<MockProxy<HttpRequestContext>>(HttpRequestContext)
  })

  describe("intercept", () => {
    it("should intercept http request context", done => {
      // Arrange
      const request = mock<Request>()
      const httpArgumentsHost = mock<HttpArgumentsHost>()
      const executionContext = mock<ExecutionContext>()
      const next = mock<CallHandler>()
      const testValue = { data: "test" }
      const handle = new Observable<any>(subscriber => {
        subscriber.next(testValue)
        subscriber.complete()
      })

      httpArgumentsHost.getRequest.mockReturnValue(request)
      executionContext.switchToHttp.mockReturnValue(httpArgumentsHost)
      next.handle.mockReturnValue(handle)

      httpRequestContext.run.mockImplementation((requestContext, callback) => {
        return callback()
      })

      // Act
      const result = interceptor.intercept(executionContext, next)

      // Assert
      result.subscribe({
        next: value => {
          expect(value).toEqual(testValue)
          expect(httpArgumentsHost.getRequest).toHaveBeenCalled()
          expect(executionContext.switchToHttp).toHaveBeenCalled()
          expect(next.handle).toHaveBeenCalled()
          expect(httpRequestContext.run).toHaveBeenCalled()
        },
        complete: () => {
          done()
        }
      })
    })

    it("should handle errors in the observable chain", done => {
      // Arrange
      const request = mock<Request>()
      const httpArgumentsHost = mock<HttpArgumentsHost>()
      const executionContext = mock<ExecutionContext>()
      const next = mock<CallHandler>()
      const testError = new Error("Test error")
      const handle = new Observable<any>(subscriber => {
        subscriber.error(testError)
      })

      httpArgumentsHost.getRequest.mockReturnValue(request)
      executionContext.switchToHttp.mockReturnValue(httpArgumentsHost)
      next.handle.mockReturnValue(handle)

      httpRequestContext.run.mockImplementation((requestContext, callback) => {
        return callback()
      })

      // Act
      const result = interceptor.intercept(executionContext, next)

      // Assert
      result.subscribe({
        error: error => {
          expect(error).toEqual(testError)
          expect(httpRequestContext.run).toHaveBeenCalled()
          done()
        }
      })
    })
  })
})
