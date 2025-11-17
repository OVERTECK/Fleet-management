using Backend.DataAccess.DTO.Requests;
using Backend.DataAccess.Entities;
using Backend.DataAccess.Repositories;

namespace Backend.API.Services;

public class TripsService(ILogger<TripsService> logger, TripsRepository tripsRepository, CarsRepository carsRepository)
{
    public async Task<List<TripEntity>> GetAll()
    {
        logger.LogInformation($"{nameof(TripEntity)}: Get all trip");

        return await tripsRepository.GetAll();
    }

    public async Task<TripEntity?> GetById(Guid id)
    {
        logger.LogInformation($"{nameof(TripEntity)}: Get trip by id");

        return await tripsRepository.GetById(id);
    }

    public async Task Create(CreateTripRequest request)
    {
        logger.LogInformation($"{nameof(TripEntity)}: Create trip");

        var searchedCar = await carsRepository.IsExists(request.CarId);

        if (!searchedCar)
        {
            throw new NullReferenceException($"Unable to find car with id {request.CarId}");
        }

        var oldCar = await carsRepository.GetByVIN(request.CarId);

        var updatedCar = new CarEntity
        {
            VIN = oldCar.VIN,
            Number = oldCar.Number,
            Model = oldCar.Model,
            Status = oldCar.Status,
            TotalKM = oldCar.TotalKM + request.TraveledKM,
        };

        await carsRepository.Update(updatedCar);

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

        await tripsRepository.Create(trip);
    }

    public async Task Update(UpdateTripRequest request)
    {
        logger.LogInformation($"{nameof(TripEntity)}: Update trip");

        var searchedCar = await carsRepository.IsExists(request.CarId);

        if (!searchedCar)
        {
            throw new NullReferenceException($"Unable to find car with id {request.CarId}");
        }

        var oldCar = await carsRepository.GetByVIN(request.CarId);
        var oldTrip = await tripsRepository.GetById(request.Id);

        var updatedCar = new CarEntity
        {
            VIN = oldCar.VIN,
            Number = oldCar.Number,
            Model = oldCar.Model,
            Status = oldCar.Status,
            TotalKM = oldCar.TotalKM - (oldTrip.TraveledKM - request.TraveledKM),
        };

        await carsRepository.Update(updatedCar);

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

        await tripsRepository.Update(trip);
    }

    public async Task Delete(Guid id)
    {
        logger.LogInformation($"{nameof(TripEntity)}: Delete trip");

        var oldTrip = await tripsRepository.GetById(id);

        var oldCar = await carsRepository.GetByVIN(oldTrip.CarId);

        var updatedCar = new CarEntity
        {
            VIN = oldCar.VIN,
            Number = oldCar.Number,
            Model = oldCar.Model,
            Status = oldCar.Status,
            TotalKM = oldCar.TotalKM - oldTrip.TraveledKM,
        };

        await carsRepository.Update(updatedCar);

        await tripsRepository.Delete(id);
    }
}