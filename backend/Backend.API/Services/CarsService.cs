using Backend.DataAccess.DTO.Requests;
using Backend.DataAccess.Entities;
using Backend.DataAccess.Repositories;

namespace Backend.API.Services;

public class CarsService(
    ILogger<CarsService> logger,
    CarsRepository carRepository)
{
    public async Task<List<CarEntity>?> GetAll()
    {
        logger.LogInformation("Get all cars");

        return await carRepository.GetAll();
    }

    public async Task<CarEntity> GetByVIN(string vin)
    {
        logger.LogInformation("Get car by id");

        var searchedCar = await carRepository.GetByVIN(vin);

        if (searchedCar == null)
        {
            throw new NullReferenceException("Car not found");
        }

        return searchedCar;
    }

    public async Task Create(CreateCarRequest request)
    {
        logger.LogInformation("Create car");

        var car = new CarEntity
        {
            VIN = request.VIN,
            Model = request.Model,
            Status = request.Status,
            Number = request.Number,
            TotalKM = request.TotalKM,
        };

        await carRepository.Create(car);
    }

    public async Task Update(CarEntity car)
    {
        logger.LogInformation("Update car");

        await carRepository.Update(car);
    }

    public async Task Delete(string vin)
    {
        logger.LogInformation("Delete car");

        await carRepository.Delete(vin);
    }
}