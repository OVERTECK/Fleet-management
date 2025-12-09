using System.Text.Json;
using Backend.DataAccess.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Distributed;

namespace Backend.DataAccess.Repositories;

public class TripsRepository(
    MyDbContext dbContext,
    IDistributedCache cache)
{
    public async Task<List<TripEntity>> GetAll()
    {
        const string cacheKey = "trips_";

        var cachedData = await cache.GetStringAsync(cacheKey);

        if (!string.IsNullOrEmpty(cachedData))
        {
            return JsonSerializer.Deserialize<List<TripEntity>>(cachedData) ?? [];
        }

        var trips = await dbContext.Trips
            .AsNoTracking()
            .Include(c => c.Route)
            .Include(c => c.Car)
            .Include(c => c.Driver)
            .ToListAsync();

        await cache.SetStringAsync(cacheKey, JsonSerializer.Serialize(trips), new DistributedCacheEntryOptions
        {
            AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(2),
            SlidingExpiration = TimeSpan.FromMinutes(2),
        });

        return trips;
    }

    public async Task<List<TripEntity>> GetByUserId(Guid userId)
    {
        var trips = await dbContext.Trips
            .AsNoTracking()
            .Include(c => c.Route)
            .Include(c => c.Car)
            .Include(c => c.Driver)
            .Where(c => c.CreatedUserId == userId)
            .ToListAsync();

        return trips;
    }

    public async Task<TripEntity?> GetById(Guid id)
    {
        await this.EnsureExists(id);

        return await dbContext.Trips
            .AsNoTracking()
            .FirstOrDefaultAsync(c => c.Id == id);
    }

    public async Task Create(TripEntity trip)
    {
        await dbContext.Trips.AddAsync(trip);

        await dbContext.SaveChangesAsync();
    }

    public async Task Update(TripEntity trip)
    {
        await using var transaction = await dbContext.Database.BeginTransactionAsync();

        try
        {
            var searchedTrip = await dbContext.Trips
                .Include(c => c.Route)
                .FirstOrDefaultAsync(c => c.Id == trip.Id);

            if (searchedTrip == null)
            {
                throw new NullReferenceException($"Trip with id {trip.Id} not found");
            }

            searchedTrip.Route.Clear();

            await dbContext.Routes.AddRangeAsync(trip.Route);

            await dbContext.SaveChangesAsync();

            await dbContext.Trips.Where(c => c.Id == trip.Id)
                .ExecuteUpdateAsync(s => s
                    .SetProperty(c => c.CarId, trip.CarId)
                    .SetProperty(c => c.DriverId, trip.DriverId)
                    .SetProperty(c => c.TimeStart, trip.TimeStart)
                    .SetProperty(c => c.TimeEnd, trip.TimeEnd)
                    .SetProperty(c => c.TraveledKM, trip.TraveledKM)
                    .SetProperty(c => c.ConsumptionLitersFuel, trip.ConsumptionLitersFuel));

            await transaction.CommitAsync();
        }
        catch (Exception)
        {
            await transaction.RollbackAsync();
        }
    }

    public async Task Delete(Guid id)
    {
        var countDeletedRows = await dbContext.Trips.Where(c => c.Id == id).ExecuteDeleteAsync();

        if (countDeletedRows == 0)
        {
            throw new NullReferenceException($"Trip with id {id} not found");
        }
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