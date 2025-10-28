using Backend.DataAccess.Entities;
using Microsoft.EntityFrameworkCore;

namespace Backend.DataAccess.Repositories;

public class TripsRepository(MyDbContext dbContext)
{
    public async Task<List<TripEntity>> GetAll()
    {
        return await dbContext.Trips.ToListAsync();
    }

    public async Task<TripEntity?> GetById(Guid id)
    {
        return await dbContext.Trips.FindAsync(id);
    }

    public async Task Create(TripEntity trip)
    {
        await dbContext.Trips.AddAsync(trip);

        await dbContext.SaveChangesAsync();
    }

    public async Task Update(TripEntity trip)
    {
        await dbContext.Trips.Where(c => c.Id == trip.Id)
            .ExecuteUpdateAsync(s => s
                .SetProperty(c => c.CarId, trip.CarId)
                .SetProperty(c => c.DriverId, trip.DriverId)
                .SetProperty(c => c.TimeStart, trip.TimeStart)
                .SetProperty(c => c.TimeEnd, trip.TimeEnd)
                .SetProperty(c => c.TraveledKM, trip.TraveledKM)
                .SetProperty(c => c.ConsumptionLitersFuel, trip.ConsumptionLitersFuel));

        await dbContext.SaveChangesAsync();
    }

    public async Task Delete(Guid id)
    {
        await dbContext.Trips.Where(c => c.Id == id).ExecuteDeleteAsync();

        await dbContext.SaveChangesAsync();
    }
}