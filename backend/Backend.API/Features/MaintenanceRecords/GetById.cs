using Backend.API.EndpointsSettings;
using Backend.API.Services;

namespace Backend.API.Features.MaintenanceRecords;

public class GetById : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapGet("maintenanceRecords/{id:guid}", async (
            Guid id,
            MaintenanceRecordGetByIdHandler handler,
            CancellationToken cancellationToken) =>
        {
            return await handler.Handle(id, cancellationToken);
        });
    }
}

sealed class MaintenanceRecordGetByIdHandler(
    ILogger<MaintenanceRecordDeleteHandler> logger,
    MaintenanceRecordsService service)
{
    public async Task<IResult> Handle(
        Guid id,
        CancellationToken cancellationToken)
    {
        try
        {
            logger.LogInformation($"{nameof(MaintenanceRecordGetByIdHandler)}: Get by id maintenance record.");

            await service.GetById(id, cancellationToken);

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

            return Results.InternalServerError($"{nameof(MaintenanceRecordCreateHandler)}: Error get by id.");
        }
    }
}