using Backend.API.EndpointsSettings;
using Backend.API.Services;
using Backend.DataAccess.Entities;

namespace Backend.API.Features.Drivers;

public class GetAllDriverEndpoint : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapGet("/drivers", async (DriverGetAllHandler handler) =>
        {
            return await handler.Handle();
        }).WithTags(nameof(DriverEntity));
    }
}

public sealed class DriverGetAllHandler(
    ILogger<CreateDriversEndpoint> logger,
    DriversService driversService)
{
    public async Task<IResult> Handle()
    {
        try
        {
            logger.LogInformation("Get all driver");

            var drivers = await driversService.GetAll();

            return Results.Ok(drivers);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, ex.Message);

            return Results.InternalServerError("Error creating driver");
        }
    }
}