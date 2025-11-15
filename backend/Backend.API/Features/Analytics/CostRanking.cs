using Backend.API.EndpointsSettings;
using Backend.DataAccess.Repositories;

namespace Backend.API.Features.Analytics;

public class CostRanking : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapGet("/costRanking", async (CostRankingHandler handler) =>
        {
            return await handler.Handle();
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

    public async Task<IResult> Handle()
    {
        var records = await _analyticsRepository.GetCostRanking(5);

        return Results.Ok(records);
    }
}