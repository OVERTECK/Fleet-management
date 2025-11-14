using Backend.DataAccess.DTO.Requests;
using Backend.DataAccess.Entities;
using Backend.DataAccess.Repositories;

namespace Backend.API.Services;

public class TripsService(ILogger<TripsService> logger, TripsRepository repository)
{
    public async Task<List<TripEntity>> GetAll()
    {
        logger.LogInformation($"{nameof(TripEntity)}: Get all trip");

        return await repository.GetAll();
    }

    public async Task<TripEntity?> GetById(Guid id)
    {
        logger.LogInformation($"{nameof(TripEntity)}: Get trip by id");

        return await repository.GetById(id);
    }

    public async Task Create(CreateTripRequest request)
    {
        logger.LogInformation($"{nameof(TripEntity)}: Create trip");

        var trip = new TripEntity
        {
            Id = Guid.NewGuid(),
            CarId = request.CarId,
            DriverId = request.DriverId,
            TimeEnd = request.TimeEnd,
            TimeStart = request.TimeStart,
            TraveledKM = request.TraveledKM,
            ConsumptionLitersFuel = request.ConsumptionLitersFuel,
        };

        await repository.Create(trip);
    }

    public async Task Update(UpdateTripRequest request)
    {
        logger.LogInformation($"{nameof(TripEntity)}: Update trip");

        var trip = new TripEntity
        {
            Id = request.Id,
            CarId = request.CarId,
            ConsumptionLitersFuel = request.ConsumptionLitersFuel,
            DriverId = request.DriverId,
            TimeEnd = request.TimeEnd,
            TimeStart = request.TimeStart,
            TraveledKM = request.TraveledKM,
        };

        await repository.Update(trip);
    }

    public async Task Delete(Guid id)
    {
        logger.LogInformation($"{nameof(TripEntity)}: Delete trip");

        await repository.Delete(id);
    }
}