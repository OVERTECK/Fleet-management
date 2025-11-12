using Backend.DataAccess.Entities;
using Backend.DataAccess.Repositories;

namespace Backend.API.Services;

public class RoutesService(ILogger<RoutesService> logger, RouteRepository repository)
{
    public async Task<List<RouteEntity>> GetAll()
    {
        logger.LogInformation($"{nameof(RouteEntity)}: Get all maintenance records");

        return await repository.GetAll();
    }

    public async Task<RouteEntity?> GetById(Guid id)
    {
        logger.LogInformation($"{nameof(RouteEntity)}: Get maintenance records by id");

        return await repository.GetById(id);
    }

    public async Task Create(RouteEntity driver)
    {
        logger.LogInformation($"{nameof(RouteEntity)}: Create maintenance record");

        driver.Id = Guid.NewGuid();

        await repository.Create(driver);
    }

    public async Task Update(RouteEntity driver)
    {
        logger.LogInformation($"{nameof(RouteEntity)}: Update maintenance record");

        await repository.Update(driver);
    }

    public async Task Delete(Guid id)
    {
        logger.LogInformation($"{nameof(RouteEntity)}: Delete maintenance record");

        await repository.Delete(id);
    }
}