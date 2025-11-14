using Backend.API.EndpointsSettings;
using Backend.API.Services;
using Backend.DataAccess.Entities;

namespace Backend.API.Features.Trips;

public class GetById : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapGet("/trips/{id:guid}", async (Guid id, TripsGetByIdHandler handler) =>
        {
            return await handler.Handle(id);
        }).WithTags(nameof(TripEntity));
    }
}

sealed class TripsGetByIdHandler(ILogger<TripsGetByIdHandler> logger, TripsService service)
{
    public async Task<IResult> Handle(Guid id)
    {
        try
        {
            logger.LogInformation($"{nameof(TripsGetByIdHandler)}");

            var trip = await service.GetById(id);

            return Results.Ok(trip);
        }
        catch (OperationCanceledException)
        {
            logger.LogInformation($"{nameof(TripsGetByIdHandler)} was cancelled");

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

            return Results.InternalServerError($"{nameof(TripsGetByIdHandler)}");
        }
    }
}