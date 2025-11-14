using Backend.API.EndpointsSettings;
using Backend.API.Services;
using Backend.DataAccess.Entities;

namespace Backend.API.Features.Targets;

public class GetAll : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapGet("/targets", async (TargetsGetAllHandler handler) =>
        {
            return await handler.Handle();
        }).WithTags(nameof(TargetEntity));
    }
}

sealed class TargetsGetAllHandler(ILogger<TargetsGetAllHandler> logger, TargetsService service)
{
    public async Task<IResult> Handle()
    {
        try
        {
            logger.LogInformation($"{nameof(TargetsGetAllHandler)}");

            var targets = await service.GetAll();

            return Results.Ok(targets);
        }
        catch (OperationCanceledException)
        {
            logger.LogInformation($"{nameof(TargetsGetAllHandler)} was cancelled");

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

            return Results.InternalServerError($"{nameof(TargetsGetAllHandler)}");
        }
    }
}