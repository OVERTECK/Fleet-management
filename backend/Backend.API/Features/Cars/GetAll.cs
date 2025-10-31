using Backend.API.EndpointsSettings;
using Backend.API.Services;
using Backend.DataAccess.Entities;
using Microsoft.AspNetCore.Mvc;

namespace Backend.API.Features.Cars;

public class GetAllCarsEndpoint : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapGet("/cars", async ([FromServices] GetAllCarsHadler handler) =>
        {
            return await handler.Handle();
        })
        .WithTags(nameof(CarEntity));
    }
}

sealed class GetAllCarsHadler
{
    private readonly ILogger<GetAllCarsHadler> _logger;
    private readonly CarsService _carsService;

    public GetAllCarsHadler(
        ILogger<GetAllCarsHadler> logger,
        CarsService carsService)
    {
        _logger = logger;
        _carsService = carsService;
    }

    public async Task<IResult> Handle()
    {
        try
        {
            var cars = await _carsService.GetAll();

            if (cars == null)
            {
                return Results.NotFound();
            }

            _logger.LogInformation("Getting all cars");

            return Results.Ok(cars);
        }
        catch (Exception e)
        {
            _logger.LogError(e.Message);

            return Results.BadRequest();
        }
    }
}