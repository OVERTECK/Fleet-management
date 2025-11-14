using Backend.DataAccess.Entities;
using Microsoft.EntityFrameworkCore;

namespace Backend.DataAccess.Repositories;

public class GasStationsRepository(MyDbContext dbContext)
{
    public async Task<List<GasStationEntity>> GetAll(CancellationToken cancellationToken = default)
    {
        return await dbContext.GasStations.ToListAsync(cancellationToken);
    }

    public async Task<GasStationEntity?> GetById(Guid id, CancellationToken cancellationToken = default)
    {
        return await dbContext.GasStations.FirstOrDefaultAsync(c => c.Id == id, cancellationToken);
    }

    public async Task Create(GasStationEntity gasStation, CancellationToken cancellationToken = default)
    {
        await dbContext.GasStations.AddAsync(gasStation, cancellationToken);

        await dbContext.SaveChangesAsync(cancellationToken);
    }

    public async Task Update(GasStationEntity gasStation, CancellationToken cancellationToken = default)
    {
        var searchedCar = await dbContext.Cars.FirstOrDefaultAsync(c => c.VIN == gasStation.CarId, cancellationToken);

        if (searchedCar == null)
        {
            throw new NullReferenceException($"Car with VIN {gasStation.CarId} not found");
        }

        var searchedGasStation = await dbContext.GasStations.FirstOrDefaultAsync(c => c.Id == gasStation.Id, cancellationToken);

        if (searchedGasStation == null)
        {
            throw new NullReferenceException($"Gas Station with VIN {gasStation.Id} not found");
        }

        await dbContext.GasStations.Where(c => c.Id == gasStation.Id)
            .ExecuteUpdateAsync(
                s => s
                .SetProperty(c => c.CarId, gasStation.CarId)
                .SetProperty(c => c.Price, gasStation.Price)
                .SetProperty(c => c.RefilledLiters, gasStation.RefilledLiters), cancellationToken);
    }

    public async Task Delete(Guid id, CancellationToken cancellationToken = default)
    {
        await dbContext.GasStations.Where(c => c.Id == id).ExecuteDeleteAsync(cancellationToken);
    }
}