using Backend.DataAccess.DTO.Responses;
using Microsoft.EntityFrameworkCore;

namespace Backend.DataAccess.Repositories;

public class AnalyticsRepository
{
    private readonly MyDbContext _dbContext;

    public AnalyticsRepository(MyDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task GetMileage()
    {

    }

    public async Task<List<CostRankingResponse>> GetCostRanking(int countRecords)
    {
        if (countRecords is <= 0 or > 100)
        {
            throw new ArgumentOutOfRangeException("countRecords must be between 0 and 100");
        }

        var sumMaintenanceRecords = await _dbContext.MaintenanceRecords
            .GroupBy(c => c.CarId)
            .Select(c => new
            {
                CarId = c.Key,
                MaintenanceCost = c.Sum(c => c.Price),
            }).ToListAsync();

        var sumFuelsRecords = await _dbContext.GasStations
            .GroupBy(c => c.CarId)
            .Select(c => new
            {
                CarId = c.Key,
                FuelCost = c.Sum(c => c.Price),
            }).ToListAsync();

        // var costRankingResponse = sumMaintenanceRecords.GroupJoin(sumFuelsRecords,
        //     maintenance => maintenance.CarId,
        //     fuel => fuel.CarId,
        //     (maintenance, fuel) => new CostRankingResponse
        //     {
        //         CarId = fuel.,
        //         FuelCost = maintenance.FuelCost,
        //         MaintenanceCost = record1.MaintenanceCost,
        //         TotalCost = record2.FuelCost + record1.MaintenanceCost,
        //     }).ToList();

        var maintenanceDict = sumMaintenanceRecords.ToDictionary(
            x => x.CarId,
            x => x.MaintenanceCost);

        var fuelDict = sumFuelsRecords.ToDictionary(
            x => x.CarId,
            x => x.FuelCost);

        var allCars = maintenanceDict.Keys.Union(fuelDict.Keys).Distinct();

        var costRankingResponse = allCars
            .Select(carId => new CostRankingResponse
            {
                CarId = carId,
                FuelCost = fuelDict.GetValueOrDefault(carId, 0),
                MaintenanceCost = maintenanceDict.GetValueOrDefault(carId, 0),
                TotalCost = maintenanceDict.GetValueOrDefault(carId, 0) + fuelDict.GetValueOrDefault(carId, 0),
            })
            .OrderByDescending(c => c.TotalCost)
            .Take(countRecords)
            .ToList();

        return costRankingResponse;
    }
}