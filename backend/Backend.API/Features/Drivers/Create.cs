using Backend.API.EndpointsSettings;
using Backend.API.Services;
using Backend.DataAccess.Entities;

namespace Backend.API.Features.Drivers;

public class CreateDriversEndpoint : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapPost("/drivers", async (DriverEntity driverEntity, DriverCreateHandler handler) =>
        {
            return await handler.Handle(driverEntity);
        }).WithTags(nameof(DriverEntity));
    }
}

public sealed class DriverCreateHandler(
    ILogger<CreateDriversEndpoint> logger,
    DriversService driversService)
{
    public async Task<IResult> Handle(DriverEntity driverEntity)
    {
        try
        {
            logger.LogInformation($"Creating driver: {driverEntity.Id}");

            await driversService.Create(driverEntity);

            return Results.Created();
        }
        catch (Exception ex)
        {
            logger.LogError(ex, ex.Message);

            return Results.InternalServerError("Error creating driver");
        }
    }
}