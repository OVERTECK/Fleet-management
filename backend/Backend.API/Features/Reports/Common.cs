using Backend.API.EndpointsSettings;
using Backend.API.Services;

namespace Backend.API.Features.Reports;

public class CommonEndpoint : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapGet("/reports/common", async (
            CommonReportHandler handler,
            IHttpContextAccessor httpContextAccessor) =>
        {
            return await handler.Handle(httpContextAccessor);
        }).WithTags("Reports");
    }
}

sealed class CommonReportHandler(
    ReportsService reportsService,
    ILogger<CommonReportHandler> logger)
{
    public async Task<IResult> Handle(IHttpContextAccessor httpContextAccessor)
    {
        try
        {
            var file = await reportsService.CreateCommnReport(httpContextAccessor);

            return file;
        }
        catch (UnauthorizedAccessException ex)
        {
            logger.LogError(ex, ex.Message);

            return Results.Unauthorized();
        }
        catch (Exception ex)
        {
            logger.LogError(ex, ex.Message);

            return Results.InternalServerError();
        }
    }
}