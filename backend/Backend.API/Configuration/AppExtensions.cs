using Backend.API.EndpointsSettings;
using Serilog;

namespace Backend.API.Configuration;

public static class AppExtensions
{
    public static IApplicationBuilder Configure(this WebApplication app)
    {
        app.UseSerilogRequestLogging();

        app.UseCors("AllowFrontend");

        app.UseSwagger();
        app.UseSwaggerUI();
        app.MapEndpoints();

        return app;
    }
}