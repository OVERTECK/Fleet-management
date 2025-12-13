using Backend.DataAccess.DTO.Requests;
using Backend.DataAccess.Entities;

namespace Backend.API.Services.Abstraction;

public interface ITripsService
{
    Task<List<TripEntity>> GetAll(IHttpContextAccessor contextAccessor);

    Task<TripEntity?> GetById(Guid id);

    Task<TripEntity> Create(CreateTripRequest request);

    Task<bool> Update(UpdateTripRequest request);

    Task Delete(Guid id);
}