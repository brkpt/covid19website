package controllers

import javax.inject._
import play.api.Configuration
import play.api.http.HttpErrorHandler
import play.api.libs.json.Json
import play.api.mvc._

@Singleton
class CoronaVirusController @Inject() (cc: ControllerComponents) extends AbstractController(cc) {
    def usCurrent = Action {
        Ok(Json.obj("content" -> "hello"))
    }
}
