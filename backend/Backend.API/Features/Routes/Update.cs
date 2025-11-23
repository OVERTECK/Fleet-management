using Backend.API.EndpointsSettings;
using Backend.API.Services;
using Backend.DataAccess.DTO.Requests;
using Backend.DataAccess.Entities;
using Microsoft.EntityFrameworkCore;

namespace Backend.API.Features.Routes;

public class Update : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapPut("/routes", async (RouteEntity entity, RoutesUpdateHandler handler) =>
        {
            return await handler.Handle(entity);
        }).WithTags(nameof(RouteEntity));
    }
}

sealed class RoutesUpdateHandler(ILogger<RoutesUpdateHandler> logger, RoutesService service)
{
    public async Task<IResult> Handle(RouteEntity entity)
    {
        try
        {
            logger.LogInformation($"{nameof(RoutesUpdateHandler)}");

            await service.Update(entity);

            return Results.Ok();
        }
        catch (OperationCanceledException)
        {
            logger.LogInformation($"{nameof(RoutesUpdateHandler)} was cancelled");

            return Results.StatusCode(499);
        }
        catch (DbUpdateException ex)
        {
            logger.LogError(ex.Message);

            return Results.BadRequest("Error. Attempt to write a non-existent foreign key.");
        }
        catch (NullReferenceException ex)
        {
            logger.LogError(ex, ex.Message);

            return Results.NotFound();
        }
        catch (Exception ex)
        {
            logger.LogError(ex, ex.Message);

            return Results.InternalServerError($"Error {nameof(RoutesUpdateHandler)}: {ex.Message}");
        }
    }
}