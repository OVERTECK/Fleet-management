using Backend.API.EndpointsSettings;
using Backend.API.Services;
using Backend.DataAccess.Entities;

namespace Backend.API.Features.Drivers;

public class GetByIdDriverEndpoint : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapGet("/drivers/{id:guid}", async (Guid id, DriverGetByIdHandler handler) =>
        {
            return await handler.Handle(id);
        }).WithTags(nameof(DriverEntity));
    }
}

public sealed class DriverGetByIdHandler(ILogger<DriverGetByIdHandler> _logger, DriversService driversService)
{
    public async Task<IResult> Handle(Guid id)
    {
        try
        {
            var searchedDriver = await driversService.GetById(id);

            return Results.Ok(searchedDriver);
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