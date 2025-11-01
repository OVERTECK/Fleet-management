using Backend.API.EndpointsSettings;
using Backend.API.Services;
using Backend.DataAccess.Entities;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;

namespace Backend.API.Features.Cars;

public class GetByIdEnpoint : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapGet("/cars/{id}", async (
            string id,
            [FromServices] CarGetByIdHandler carGetByIdHandler) =>
        {
            return await carGetByIdHandler.Handle(id);
        }).WithTags(nameof(CarEntity));
    }
}

sealed class CarGetByIdHandler
{
    private readonly CarsService _carsService;
    private readonly ILogger<GetByIdEnpoint> _logger;

    public CarGetByIdHandler(
        CarsService carsService,
        ILogger<GetByIdEnpoint> logger)
    {
        _carsService = carsService;
        _logger = logger;
    }

    public async Task<IResult> Handle(string vin)
    {
        try
        {
            var searchedCar = await _carsService.GetByVIN(vin);

            return Results.Ok(searchedCar);
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