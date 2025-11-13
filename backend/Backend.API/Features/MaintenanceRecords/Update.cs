using Backend.API.EndpointsSettings;
using Backend.API.Services;
using Backend.DataAccess.Entities;

namespace Backend.API.Features.MaintenanceRecords;

public class Update : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapPut("/maintenanceRecords", async (
            MaintenanceRecordEntity entity,
            MaintenanceRecordUpdateHandler handler,
            CancellationToken cancellationToken) =>
        {
            return await handler.Handle(entity, cancellationToken);
        }).WithTags(nameof(MaintenanceRecordEntity));
    }
}

sealed class MaintenanceRecordUpdateHandler(
    ILogger<MaintenanceRecordCreateHandler> logger,
    MaintenanceRecordsService service)
{
    public async Task<IResult> Handle(
        MaintenanceRecordEntity entity,
        CancellationToken cancellationToken)
    {
        try
        {
            logger.LogInformation($"Updating maintenance record.");

            await service.Update(entity, cancellationToken);

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

            return Results.InternalServerError(
                $"Error updating {nameof(MaintenanceRecordCreateHandler)}: {ex.Message}");
        }
    }
}