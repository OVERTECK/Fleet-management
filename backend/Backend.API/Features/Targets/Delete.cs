using Backend.API.EndpointsSettings;
using Backend.API.Services;
using Backend.DataAccess.Entities;

namespace Backend.API.Features.Targets;

public class Delete : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapDelete("/targets/{id:guid}", async (Guid id, TargetsDeleteHandler handler) =>
        {
            return await handler.Handle(id);
        }).WithTags(nameof(TargetEntity));
    }
}

sealed class TargetsDeleteHandler(ILogger<TargetsDeleteHandler> logger, TargetsService service)
{
    public async Task<IResult> Handle(Guid id)
    {
        try
        {
            logger.LogInformation($"{nameof(TargetsDeleteHandler)}");

            await service.Delete(id);

            return Results.Ok();
        }
        catch (OperationCanceledException)
        {
            logger.LogInformation($"{nameof(TargetsDeleteHandler)} was cancelled");

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

            return Results.InternalServerError($"{nameof(TargetsDeleteHandler)}");
        }
    }
}