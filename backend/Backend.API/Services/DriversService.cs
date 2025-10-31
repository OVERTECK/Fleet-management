using Backend.DataAccess.Entities;
using Backend.DataAccess.Repositories;

namespace Backend.API.Services;

public class DriversService(
    ILogger<DriversService> logger,
    DriversRepository driversRepository)
{
    public async Task<List<DriverEntity>> GetAll()
    {
        logger.LogInformation("Get all drivers");

        return await driversRepository.GetAll();
    }

    public async Task<DriverEntity?> GetById(Guid id)
    {
        logger.LogInformation("Get driver by id");

        return await driversRepository.GetById(id);
    }

    public async Task Create(DriverEntity driver)
    {
        logger.LogInformation("Create driver");

        await driversRepository.Create(driver);
    }

    public async Task Update(DriverEntity driver)
    {
        logger.LogInformation("Update driver");

        await driversRepository.Update(driver);
    }

    public async Task Delete(Guid id)
    {
        logger.LogInformation("Delete driver");

        await driversRepository.Delete(id);
    }
}