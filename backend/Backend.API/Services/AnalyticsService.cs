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

    public async Task GetCostRankings()
    {
        _logger.LogInformation($"{nameof(AnalyticsService)} started");

        // return _analyticsRepository.GetCostRanking(20);
    }
}