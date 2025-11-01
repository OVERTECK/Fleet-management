using Backend.API.EndpointsSettings;
using Backend.API.Services;
using Backend.DataAccess.Entities;
using Microsoft.AspNetCore.Mvc;

namespace Backend.API.Features.Cars;

public class UpdateCarEndpoint : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapPut("/cars", async (
            [FromBody] CarEntity car,
            [FromServices] CarUpdateHandler handler) =>
        {
            return await handler.Handle(car);
        }).WithTags(nameof(CarEntity));
    }
}

class CarUpdateHandler
{
    private readonly CarsService _carsService;
    private readonly ILogger<CarUpdateHandler> _logger;

    public CarUpdateHandler(
        CarsService carsService,
        ILogger<CarUpdateHandler> logger)
    {
        _carsService = carsService;
        _logger = logger;
    }

    public async Task<IResult> Handle(CarEntity car)
    {
        try
        {
            await _carsService.Update(car);

            _logger.LogInformation("Car updated");

            return Results.Ok();
        }
        catch (NullReferenceException ex)
        {
            _logger.LogError(ex, ex.Message);

            return Results.NotFound();
        }
        catch (Exception)
        {
            _logger.LogError($"Error while updating car: {car.VIN}");
            
            return Results.InternalServerError("Error updating car");
        }
    }
}