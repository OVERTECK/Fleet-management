using Backend.DataAccess.Entities;
using Microsoft.EntityFrameworkCore;

namespace Backend.DataAccess.Repositories;

public class GasStationsRepository(MyDbContext dbContext)
{
    public async Task<List<GasStationEntity>> GetAll()
    {
        return await dbContext.GasStations.ToListAsync();
    }

    public async Task<GasStationEntity?> GetById(Guid id)
    {
        return await dbContext.GasStations.FindAsync(id);
    }

    public async Task Create(GasStationEntity gasStation)
    {
        await dbContext.GasStations.AddAsync(gasStation);

        await dbContext.SaveChangesAsync();
    }

    public async Task Update(GasStationEntity gasStation)
    {
        await dbContext.GasStations.Where(c => c.Id == gasStation.Id)
            .ExecuteUpdateAsync(s => s
                .SetProperty(c => c.CarId, gasStation.CarId)
                .SetProperty(c => c.Price, gasStation.Price)
                .SetProperty(c => c.RefilledLiters, gasStation.RefilledLiters));

        await dbContext.SaveChangesAsync();
    }

    public async Task Delete(Guid id)
    {
        await dbContext.GasStations.Where(c => c.Id == id).ExecuteDeleteAsync();

        await dbContext.SaveChangesAsync();
    }
}