using Backend.API.EndpointsSettings;
using Backend.API.Services;
using Backend.DataAccess.Entities;

namespace Backend.API.Features.Drivers;

public class UpdateDriverEndpoint : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapPut("/driver", async (DriverEntity driverEntity, DriverUpdateHandler handler) =>
        {
            return await handler.Handle(driverEntity);
        }).WithTags(nameof(DriverEntity));
    }
}

public sealed class DriverUpdateHandler(ILogger<UpdateDriverEndpoint> _logger, DriversService service)
{
    public async Task<IResult> Handle(DriverEntity driver)
    {
        try
        {
            await service.Update(driver);

            return Results.Ok();
        }
        catch (NullReferenceException ex)
        {
            _logger.LogError(ex, ex.Message);

            return Results.NotFound();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, ex.Message);

            return Results.InternalServerError("Error updating driver");
        }
    }
}