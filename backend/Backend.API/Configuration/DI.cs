using Backend.API.EndpointsSettings;
using Backend.API.Features.Cars;
using Serilog;
using Serilog.Exceptions;

namespace Backend.API.Configuration;

public static class DI
{
    public static IServiceCollection AddConfiguration(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddScoped<CreateHandler>();

        return services
            .AddSerilogLogging(configuration)
            .AddOpenApiSpec()
            .AddEndpoints(typeof(DI).Assembly);
    }

    private static IServiceCollection AddOpenApiSpec(this IServiceCollection services)
    {
        services.AddOpenApi();

        services.AddEndpoints(typeof(Program).Assembly);

        services.AddSwaggerGen();

        return services;
    }

    private static IServiceCollection AddSerilogLogging(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddSerilog((services, lc) => lc
            .ReadFrom.Configuration(configuration)
            .ReadFrom.Services(services)
            .Enrich.FromLogContext()
            .Enrich.WithExceptionDetails()
            .Enrich.WithProperty("Application", "Backend.API"));

        return services;
    }
}