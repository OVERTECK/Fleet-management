using Backend.DataAccess.Entities;
using Backend.DataAccess.Repositories;

namespace Backend.API.Services;

public class MaintenanceRecordsService(MaintenanceRecordsRepository repository, ILogger<MaintenanceRecordsService> logger)
{
    public async Task<List<MaintenanceRecordEntity>> GetAll()
    {
        logger.LogInformation($"{nameof(MaintenanceRecordEntity)}: Get all maintenance records");

        return await repository.GetAll();
    }

    public async Task<MaintenanceRecordEntity?> GetById(Guid id)
    {
        logger.LogInformation($"{nameof(MaintenanceRecordEntity)}: Get maintenance records by id");

        return await repository.GetById(id);
    }

    public async Task Create(MaintenanceRecordEntity driver)
    {
        logger.LogInformation($"{nameof(MaintenanceRecordEntity)}: Create maintenance record");

        driver.Id = Guid.NewGuid();

        await repository.Create(driver);
    }

    public async Task Update(MaintenanceRecordEntity driver)
    {
        logger.LogInformation($"{nameof(MaintenanceRecordEntity)}: Update maintenance record");

        await repository.Update(driver);
    }

    public async Task Delete(Guid id)
    {
        logger.LogInformation($"{nameof(MaintenanceRecordEntity)}: Delete maintenance record");

        await repository.Delete(id);
    }
}