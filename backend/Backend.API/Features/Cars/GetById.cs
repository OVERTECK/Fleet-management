using Backend.API.EndpointsSettings;
using Backend.API.Services;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;

namespace Backend.API.Features.Cars;

public class GetByIdEnpoint : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapGet("/cars/{id}", async (
            string id,
            [FromServices] GetByIdCarHandler getByIdCarHandler) =>
        {
            return await getByIdCarHandler.Handle(id);
        });
    }
}

sealed class GetByIdCarHandler
{
    private readonly CarsService _carsService;
    private readonly ILogger<GetByIdEnpoint> _logger;

    public GetByIdCarHandler(
        CarsService carsService,
        ILogger<GetByIdEnpoint> logger)
    {
        _carsService = carsService;
        _logger = logger;
    }

    public async Task<IResult> Handle(string vin)
    {
        var searchedCar = await _carsService.GetByVIN(vin);

        if (searchedCar == null)
        {
            return Results.NotFound();
        }

        return Results.Ok(searchedCar);
    }
}