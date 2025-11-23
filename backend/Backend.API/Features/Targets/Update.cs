using Backend.API.EndpointsSettings;
using Backend.API.Services;
using Backend.DataAccess.DTO.Requests;
using Backend.DataAccess.Entities;
using Microsoft.EntityFrameworkCore;

namespace Backend.API.Features.Targets;

public class Update : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapPut("/targets", async (UpdateTargetRequest request, TargetsUpdateHandler handler) =>
        {
            return await handler.Handle(request);
        }).WithTags(nameof(TargetEntity));
    }
}

sealed class TargetsUpdateHandler(ILogger<TargetsUpdateHandler> logger, TargetsService service)
{
    public async Task<IResult> Handle(UpdateTargetRequest request)
    {
        try
        {
            logger.LogInformation($"{nameof(TargetsUpdateHandler)}");

            await service.Update(request);

            return Results.Ok();
        }
        catch (OperationCanceledException)
        {
            logger.LogInformation($"{nameof(TargetsUpdateHandler)} was cancelled");

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

            return Results.InternalServerError($"{nameof(TargetsUpdateHandler)}");
        }
    }
}