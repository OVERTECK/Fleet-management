using Backend.DataAccess.DTO.Requests;
using Backend.DataAccess.Entities;
using Backend.DataAccess.Repositories;

namespace Backend.API.Services;

public class RoutesService(ILogger<RoutesService> logger, RouteRepository repository)
{
    public async Task<List<RouteEntity>> GetAll()
    {
        logger.LogInformation($"{nameof(RouteEntity)}: Get all routes");

        return await repository.GetAll();
    }

    public async Task<RouteEntity?> GetById(Guid id)
    {
        logger.LogInformation($"{nameof(RouteEntity)}: Get routes by id");

        return await repository.GetById(id);
    }

    public async Task Create(CreateRouteRequest request)
    {
        logger.LogInformation($"{nameof(RouteEntity)}: Create route");

        var routeId = Guid.NewGuid();

        var route = new RouteEntity
        {
            Id = routeId,
            TimeStamp = request.TimeStamp,
            Latitude = request.Latitude,
            Longitude = request.Longitude,
            TripId = routeId,
            Address = request.Address,
        };

        await repository.Create(route);
    }

    public async Task Update(RouteEntity route)
    {
        logger.LogInformation($"{nameof(RouteEntity)}: Update route");

        await repository.Update(route);
    }

    public async Task Delete(Guid id)
    {
        logger.LogInformation($"{nameof(RouteEntity)}: Delete route");

        await repository.Delete(id);
    }
}