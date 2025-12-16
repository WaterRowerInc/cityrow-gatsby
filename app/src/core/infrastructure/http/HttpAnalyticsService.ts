import { HttpLambdaClient } from "./HttpLambdaClient";
import { IdentifyRequest } from "../../domain/analytics/IdentifyRequest";
import { PageRequest } from "../../domain/analytics/PageRequest";
import { TrackRequest } from "../../domain/analytics/TrackRequest";

export class HttpAnalyticsService {
  private httpAnalyticsClient: HttpLambdaClient;

  constructor(httpAnalyticsClient: HttpLambdaClient) {
    this.httpAnalyticsClient = httpAnalyticsClient;
  }

  identify = async (identifyRequest: IdentifyRequest) =>
    await this.httpAnalyticsClient.post("/identify/", identifyRequest);

  page = async (pageRequest: PageRequest) => await this.httpAnalyticsClient.post("/page/", pageRequest);

  track = async (trackRequest: TrackRequest) => await this.httpAnalyticsClient.post("/track/", trackRequest);
}
