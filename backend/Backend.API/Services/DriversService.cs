using Backend.DataAccess.DTO.Requests.Driver;
using Backend.DataAccess.Entities;
using Backend.DataAccess.Repositories;

namespace Backend.API.Services;

public class DriversService(
    ILogger<DriversService> logger,
    DriversRepository driversRepository)
{
    public async Task<List<DriverEntity>> GetAll()
    {
        logger.LogInformation($"{nameof(DriversService)}: Get all drivers");

        return await driversRepository.GetAll();
    }

    public async Task<DriverEntity?> GetById(Guid id)
    {
        logger.LogInformation($"{nameof(DriversService)}: Get driver by id");

        return await driversRepository.GetById(id);
    }

    public async Task Create(CreateDriverRequest driverRequest)
    {
        logger.LogInformation($"{nameof(DriversService)}: Create driver");

        var driver = new DriverEntity
        {
            Id = Guid.NewGuid(),
            Name = driverRequest.Name,
            CategoryDrive = driverRequest.CategoryDrive,
            ContactData = driverRequest.ContactData,
            LastName = driverRequest.LastName,
            Pathronymic = driverRequest.Pathronymic,
        };

        await driversRepository.Create(driver);
    }

    public async Task Update(DriverEntity driver)
    {
        logger.LogInformation($"{nameof(DriversService)}: Update driver");

        await driversRepository.Update(driver);
    }

    public async Task Delete(Guid id)
    {
        logger.LogInformation($"{nameof(DriversService)}: Delete driver");

        await driversRepository.Delete(id);
    }
}