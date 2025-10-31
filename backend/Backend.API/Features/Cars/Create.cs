using Backend.API.EndpointsSettings;
using Backend.API.Services;
using Backend.DataAccess.DTO.Requests;
using Backend.DataAccess.Entities;

namespace Backend.API.Features.Cars;

public class CreateEndpoint : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapPost("/cars", async (CreateCarRequest carRequest, CreateHandler handler) =>
        {
            return await handler.Handle(carRequest);
        })
        .WithTags(nameof(CarEntity));
    }
}

sealed class CreateHandler
{
    private readonly ILogger<CreateHandler> _logger;
    private readonly CarsService _carsService;

    public CreateHandler(
        ILogger<CreateHandler> logger,
        CarsService carsService)
    {
        _logger = logger;
        _carsService = carsService;
    }

    public async Task<IResult> Handle(CreateCarRequest carRequest)
    {
        try
        {
            _logger.LogInformation($"Creating car: {carRequest.VIN}");

            await _carsService.Create(carRequest);

            return Results.Created();
        }
        catch (Exception e)
        {
            _logger.LogError(e, e.Message);

            return Results.BadRequest();
        }
    }
}