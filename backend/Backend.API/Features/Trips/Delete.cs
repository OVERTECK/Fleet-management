using Backend.API.EndpointsSettings;
using Backend.API.Services;
using Backend.DataAccess.Entities;

namespace Backend.API.Features.Trips;

public class Delete : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapDelete("/trips/{id:guid}", async (Guid id, TripsDeleteHandler handler) =>
        {
            return await handler.Handle(id);
        }).WithTags(nameof(TripEntity));
    }
}

sealed class TripsDeleteHandler(ILogger<TripsDeleteHandler> logger, TripsService service)
{
    public async Task<IResult> Handle(Guid id)
    {
        try
        {
            logger.LogInformation($"{nameof(TripsDeleteHandler)}");

            await service.Delete(id);

            return Results.Ok();
        }
        catch (OperationCanceledException)
        {
            logger.LogInformation($"{nameof(TripsDeleteHandler)} was cancelled");

            return Results.StatusCode(499);
        }
        catch (NullReferenceException ex)
        {
            logger.LogError(ex, ex.Message);

            return Results.NotFound();
        }
        catch (Exception ex)
        {
            logger.LogError(ex, ex.Message);

            return Results.InternalServerError($"{nameof(TripsDeleteHandler)}");
        }
    }
}