using Backend.API.EndpointsSettings;
using Backend.API.Services;
using Backend.DataAccess.Entities;

namespace Backend.API.Features.Drivers;

public class DeleteDriverEndpoint : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapDelete("drivers/{id:guid}", async (Guid id, DriverDeleteHandler handler) =>
        {
            return await handler.Handle(id);
        }).WithTags(nameof(DriverEntity));
    }
}

public sealed class DriverDeleteHandler(ILogger<DriverDeleteHandler> _logger, DriversService driversService)
{
    public async Task<IResult> Handle(Guid id)
    {
        try
        {
            await driversService.Delete(id);

            return Results.Ok();
        }
        catch (OperationCanceledException)
        {
            _logger.LogInformation($"{nameof(DriverDeleteHandler)} was cancelled");

            return Results.StatusCode(499);
        }
        catch (NullReferenceException ex)
        {
            _logger.LogError(ex, ex.Message);

            return Results.NotFound();
        }
        catch (Exception e)
        {
            _logger.LogError(e, e.Message);

            return Results.InternalServerError("Error delete car");
        }
    }
}