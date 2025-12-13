using Backend.DataAccess.Entities;

namespace Backend.DataAccess.Repositories.Abstractions;

public interface ITripsRepository
{
    Task<List<TripEntity>> GetAll();

    Task<List<TripEntity>> GetByUserId(Guid userId);

    Task<TripEntity?> GetById(Guid id);

    Task<TripEntity> Create(TripEntity trip);

    Task<TripEntity?> Update(TripEntity trip);

    Task Delete(Guid id);

    Task AddRange(List<TripEntity> trips);

    Task EnsureExists(Guid id);
}