using Backend.DataAccess.DTO.Responses;
using Backend.DataAccess.Repositories;

namespace Backend.API.Services;

public class AnalyticsService
{
    private readonly AnalyticsRepository _analyticsRepository;
    private readonly ILogger<AnalyticsService> _logger;

    public AnalyticsService(
        AnalyticsRepository analyticsRepository,
        ILogger<AnalyticsService> logger)
    {
        _analyticsRepository = analyticsRepository;
        _logger = logger;
    }

    public async Task<List<CostRankingResponse>> GetCostRankings(int countRecords)
    {
        _logger.LogInformation($"{nameof(AnalyticsService)} started");

        return await _analyticsRepository.GetCostRanking(countRecords);
    }
}