using System.Text.Json;
using Backend.API.Services.Abstraction;
using Backend.DataAccess.Entities;
using Backend.DataAccess.Repositories;
using Backend.DataAccess.Repositories.Abstractions;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Distributed;

namespace Backend.API.Services;

public class TripsCacheService(
    IDistributedCache cache,
    ITripsRepository tripsRepository) : ITripsCacheService
{
    public async Task<List<TripEntity>> GetAll()
    {
        const string cacheKey = "trips_";

        var cachedData = await cache.GetStringAsync(cacheKey);

        if (!string.IsNullOrEmpty(cachedData))
        {
            var deserializedTrips = JsonSerializer.Deserialize<List<TripEntity>>(cachedData) ?? [];

            return deserializedTrips;
        }

        var trips = await tripsRepository.GetAll();

        await cache.SetStringAsync(cacheKey, JsonSerializer.Serialize(trips), new DistributedCacheEntryOptions
        {
            AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(2),
            SlidingExpiration = TimeSpan.FromMinutes(2),
        });

        return trips;
    }
}