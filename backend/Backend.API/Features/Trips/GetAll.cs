using Backend.API.EndpointsSettings;
using Backend.API.Services;
using Backend.DataAccess.Entities;
using Microsoft.AspNetCore.Authorization;

namespace Backend.API.Features.Trips;

public class GetAll : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapGet("/trips", async (TripsGetAllHandler handler) =>
            {
                return await handler.Handle();
            })
            .WithTags(nameof(TripEntity))
            .RequireAuthorization("Staff");
    }
}

sealed class TripsGetAllHandler(
    ILogger<TripsGetAllHandler> logger,
    TripsService service,
    IHttpContextAccessor httpContextAccessor)
{
    public async Task<IResult> Handle()
    {
        try
        {
            logger.LogInformation($"{nameof(TripsGetAllHandler)}");

            var trips = await service.GetAll(httpContextAccessor);

            return Results.Ok(trips);
        }
        catch (OperationCanceledException)
        {
            logger.LogInformation($"{nameof(TripsGetAllHandler)} was cancelled");

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

            return Results.InternalServerError($"{nameof(TripsGetAllHandler)}");
        }
    }
}