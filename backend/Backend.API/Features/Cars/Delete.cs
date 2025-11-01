using Backend.API.EndpointsSettings;
using Backend.API.Services;
using Backend.DataAccess.Entities;

namespace Backend.API.Features.Cars;

public class DeleteCarEndpoint : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapDelete("cars/{id}", async (string id, CarDeleteHandler handler) =>
        {
            return await handler.Handle(id);
        }).WithTags(nameof(CarEntity));
    }
}

sealed class CarDeleteHandler
{
    private readonly ILogger<CarDeleteHandler> _logger;
    private readonly CarsService _carsService;

    public CarDeleteHandler(
        ILogger<CarDeleteHandler> logger,
        CarsService carsService)
    {
        _logger = logger;
        _carsService = carsService;
    }

    public async Task<IResult> Handle(string id)
    {
        try
        {
            await _carsService.Delete(id);

            _logger.LogInformation("Delete Car {id}", id);

            return Results.Ok();
        }
        catch (NullReferenceException ex)
        {
            _logger.LogError(ex, ex.Message);

            return Results.NotFound();
        }
        catch (Exception e)
        {
            _logger.LogError(e, e.Message);
            
            return Results.InternalServerError("Error updating car");
        }
    }
}