package controllers

import javax.inject._
import play.api.Configuration
import play.api.http.HttpErrorHandler
import play.api.libs.json.Json
import play.libs.ws._
import play.api.mvc._
import scala.concurrent.java8.FuturesConvertersImpl._

@Singleton
class CoronaVirusController @Inject() (ws: WSClient, val cc: ControllerComponents) extends AbstractController(cc) {
    def usCurrent = Action {
        val request: WSRequest = ws.url("https://covidtracking.com/api/v1/us/current.json")
        val result = request.addHeader("Accept", "application/json").get().toCompletableFuture.get()
        Ok(Json.parse(result.getBody))
    }

  def usDaily = Action {
    val request: WSRequest = ws.url("https://covidtracking.com/api/us/daily")
    val result = request.addHeader("Accept", "application/json").get().toCompletableFuture.get()
    Ok(Json.parse(result.getBody))
  }

  def stateHistorical = Action {
    val request: WSRequest = ws.url("https://covidtracking.com/api/v1/states/ut/daily.json")
    val result = request.addHeader("Accept", "application/json").get().toCompletableFuture.get()
    Ok(Json.parse(result.getBody))
  }

  def historicalByState(state: String) = Action {
    val request: WSRequest = ws.url(s"https://covidtracking.com/api/v1/states/$state/daily.json")
    val result = request.addHeader("Accept", "application/json").get().toCompletableFuture.get()
    Ok(Json.parse(result.getBody))
  }
}
