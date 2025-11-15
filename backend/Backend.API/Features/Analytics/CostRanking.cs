using Backend.API.EndpointsSettings;
using Backend.DataAccess.Repositories;

namespace Backend.API.Features.Analytics;

public class CostRanking : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapGet("/costRanking/{count:int}", async (int count, CostRankingHandler handler) =>
        {
            return await handler.Handle(count);
        });
    }
}

sealed class CostRankingHandler
{
    private readonly AnalyticsRepository _analyticsRepository;

    public CostRankingHandler(AnalyticsRepository analyticsRepository)
    {
        _analyticsRepository = analyticsRepository;
    }

    public async Task<IResult> Handle(int countRecords)
    {
        var records = await _analyticsRepository.GetCostRanking(countRecords);

        return Results.Ok(records);
    }
}