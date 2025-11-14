using Backend.API.EndpointsSettings;
using Backend.API.Services;
using Backend.DataAccess.Entities;

namespace Backend.API.Features.Routes;

public class Delete : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapDelete("/routes/{id:guid}", async (Guid id, RoutesDeleteHandler handler) =>
        {
            return await handler.Handle(id);
        }).WithTags(nameof(RouteEntity));
    }
}

sealed class RoutesDeleteHandler(ILogger<RoutesCreateHandler> logger, RoutesService service)
{
    public async Task<IResult> Handle(Guid id)
    {
        try
        {
            logger.LogInformation($"Deleting route.");

            await service.Delete(id);

            return Results.Ok();
        }
        catch (OperationCanceledException)
        {
            logger.LogInformation($"{nameof(RoutesDeleteHandler)} was cancelled");

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

            return Results.InternalServerError($"Error creating {nameof(RoutesDeleteHandler)}: {ex.Message}");
        }
    }
}