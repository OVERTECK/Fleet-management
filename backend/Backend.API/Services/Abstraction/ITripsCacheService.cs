using Backend.DataAccess.Entities;

namespace Backend.API.Services.Abstraction;

public interface ITripsCacheService
{
    Task<List<TripEntity>> GetAll();
}