using Backend.API.EndpointsSettings;
using Backend.API.Services;
using Backend.DataAccess.DTO.Requests.Driver;
using Backend.DataAccess.Entities;
using Microsoft.EntityFrameworkCore;

namespace Backend.API.Features.Drivers;

public class CreateDriversEndpoint : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapPost("/drivers", async (CreateDriverRequest driverRequest, DriverCreateHandler handler) =>
        {
            return await handler.Handle(driverRequest);
        }).WithTags(nameof(DriverEntity));
    }
}

public sealed class DriverCreateHandler(
    ILogger<CreateDriversEndpoint> logger,
    DriversService driversService)
{
    public async Task<IResult> Handle(CreateDriverRequest driverRequest)
    {
        try
        {
            logger.LogInformation($"{nameof(DriverCreateHandler)}: creating driver");

            await driversService.Create(driverRequest);

            return Results.Created();
        }
        catch (DbUpdateException ex)
        {
            logger.LogError(ex.Message);

            return Results.BadRequest("Error. Attempt to write a non-existent foreign key.");
        }
        catch (Exception ex)
        {
            logger.LogError(ex, ex.Message);

            return Results.InternalServerError("Error creating driver");
        }
    }
}