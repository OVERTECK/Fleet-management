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
        await this.EnsureExists(id);

        return await dbContext.Trips.FirstOrDefaultAsync(c => c.Id == id);
    }

    public async Task Create(TripEntity trip)
    {
        await dbContext.Trips.AddAsync(trip);

        await dbContext.SaveChangesAsync();
    }

    public async Task Update(TripEntity trip)
    {
        await this.EnsureExists(trip.Id);

        await dbContext.Trips.Where(c => c.Id == trip.Id)
            .ExecuteUpdateAsync(s => s
                .SetProperty(c => c.CarId, trip.CarId)
                .SetProperty(c => c.DriverId, trip.DriverId)
                .SetProperty(c => c.TimeStart, trip.TimeStart)
                .SetProperty(c => c.TimeEnd, trip.TimeEnd)
                .SetProperty(c => c.TraveledKM, trip.TraveledKM)
                .SetProperty(c => c.ConsumptionLitersFuel, trip.ConsumptionLitersFuel));
    }

    public async Task Delete(Guid id)
    {
        await this.EnsureExists(id);

        await dbContext.Trips.Where(c => c.Id == id).ExecuteDeleteAsync();
    }

    public async Task EnsureExists(Guid id)
    {
        var trip = await dbContext.Trips.FindAsync(id);

        if (trip == null)
        {
            throw new NullReferenceException($"Unable to find trip with id {id}");
        }
    }
}