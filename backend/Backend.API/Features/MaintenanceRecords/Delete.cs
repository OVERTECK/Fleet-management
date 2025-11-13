using Backend.API.EndpointsSettings;
using Backend.API.Services;

namespace Backend.API.Features.MaintenanceRecords;

public class Delete : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapDelete("/maintenance/{id:guid}", async (
            Guid id,
            MaintenanceRecordDeleteHandler handler,
            CancellationToken cancellationToken) =>
        {
            return await handler.Handle(id, cancellationToken);
        });
    }
}

sealed class MaintenanceRecordDeleteHandler(
    ILogger<MaintenanceRecordDeleteHandler> logger,
    MaintenanceRecordsService service)
{
    public async Task<IResult> Handle(
        Guid id,
        CancellationToken cancellationToken)
    {
        try
        {
            logger.LogInformation($"Creating maintenance record.");

            await service.Delete(id, cancellationToken);

            return Results.Ok();
        }
        catch (OperationCanceledException)
        {
            logger.LogInformation($"{nameof(MaintenanceRecordCreateHandler)} was cancelled");

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

            return Results.InternalServerError($"Error creating {nameof(MaintenanceRecordCreateHandler)}: {ex.Message}");
        }
    }
}