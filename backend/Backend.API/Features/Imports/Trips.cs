using Backend.API.EndpointsSettings;
using ClosedXML.Excel;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;

namespace Backend.API.Features.Imports;

public class TripsImportsEndpoint : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapPost("/import/trips", async (
            TripsImportHandler handler,
            IFormFile file,
            HttpContext httpContext) =>
        {
            return await handler.Handle(file, httpContext);
        }).WithTags("Imports");
    }
}

sealed class TripsImportHandler(ILogger<TripsImportHandler> logger)
{
    public async Task<IResult> Handle(IFormFile file, HttpContext httpContext)
    {
        try
        {
            if (file == null)
            {
                throw new NullReferenceException("File not found");
            }

            using (var stream = new MemoryStream())
            {
                await file.CopyToAsync(stream);

                using (var workbook = new XLWorkbook())
                {
                    var worksheet = workbook.Worksheet(0);

                    var data = worksheet.Cell(1, 1).Value;
                }
            }

            return Results.NoContent();
        }
        catch (Exception ex)
        {
            logger.LogError(ex, ex.Message);

            return Results.InternalServerError();
        }
    }
}